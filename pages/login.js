import { Inconsolata } from "@next/font/google";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
	useUser,
	useSession,
	useSupabaseClient,
} from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
	Table,
	Header,
	HeaderRow,
	HeaderCell,
	Body,
	Row,
	Cell,
} from "@table-library/react-table-library/table";
import { usePagination } from "@table-library/react-table-library/pagination";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import Image from "next/image";

// URL of the CDN + user.id + uuid image name
const CDNmeme =
	"https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/";

const inconsolata = Inconsolata({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
});

const Login = () => {
	const theme = useTheme(getTheme());
	const session = useSession();
	const supabase = useSupabaseClient();
	const user = useUser();
	const [memes, setMemes] = useState([]);
	const data = { nodes: memes };

	async function getMemes(pagination) {
		// const { data, error } = await supabase.storage
		// 	.from("memes")
		// 	.list(user?.id + "/", {
		// 		limit: 100,
		// 		offset: 0,
		// 		sortBy: { column: "name", order: "asc" },
		// 	});
		const { data, error } = await supabase
			.from("memes")
			.select()
			.order("id", { ascending: true });

		if (data !== null) {
			setMemes(data);
		} else {
			alert("Error loading memes");
		}
	}

	useEffect(() => {
		if (user) {
			getMemes();
		}
	}, [user]);

	const pagination = usePagination(data, {
		state: {
			page: 0,
			size: 14,
		},
	});

	// console.log(data);
	// console.log(memes.length);

	async function uploadMeme(e) {
		let meme = e.target.files[0];
		let memeName = meme.name;
		let uuid = uuidv4();
		// upload only to the folder of the user that actually uploaded the meme
		// use the user id so we differentiate the memes with the same name, generate random ID
		const { data, error } = await supabase.storage
			.from("memes")
			.upload(user.id + "/" + memeName + "dev-memes.com" + uuid, meme);
		if (data) {
			await supabase.from("memes").insert([
				{
					name: memeName,
					href: user.id + "/" + memeName + "dev-memes.com" + uuid,
					image_src: user.id + "/" + memeName + "dev-memes.com" + uuid,
					user_id: user?.id,
				},
			]);
			getMemes();
		} else {
			console.log(error);
		}
	}

	async function deleteMeme(memeName, memeId) {
		// delete from storage
		const { data, error } = await supabase.storage
			.from("memes")
			.remove([memeName]);
		// delete from db
		await supabase.from("memes").delete().match({ id: memeId });
		if (error) {
			alert(error);
		} else {
			getMemes();
		}
	}

	return (
		<>
			<div className='container logged ' style={{ padding: "50px 0 100px 0" }}>
				<div className={inconsolata.className}>
					{!session ? (
						<>
							<div className='logo'></div>
							<div className='row'>
								<div className='twelve columns text-center'>
									<Auth
										supabaseClient={supabase}
										appearance={{ theme: ThemeSupa }}
										theme='dark'
									/>
								</div>
							</div>
						</>
					) : (
						<div>
							<div className='top-header'>
								{/* Here I want to pass random cool greeting, like Hi email you meme uploader, etc */}
								<h5>Hi {user.email}</h5>
								<button
									className='sign-out'
									onClick={() => supabase.auth.signOut()}
								>
									Sign out
								</button>
							</div>
							<div className='logo'></div>

							<form>
								<label htmlFor='upload-meme' className='button'>
									Upload Meme
								</label>
								<input
									type='file'
									id='upload-meme'
									accept='image/png, image/jpg, image/jpeg'
									onChange={(e) => uploadMeme(e)}
									style={{ visibility: "hidden" }}
								/>
							</form>
							{/* This will bea table with small thumbnail plus image name and delete button */}
							{memes.length > 0 ? (
								<>
									<h4>All memes:</h4>
									<Table data={data} pagination={pagination} theme={theme}>
										{(tableList) => (
											<>
												<Header>
													<HeaderRow>
														<HeaderCell>Meme</HeaderCell>
														<HeaderCell>UUID Name</HeaderCell>
														<HeaderCell>Action</HeaderCell>
													</HeaderRow>
												</Header>
												<Body>
													{tableList.map((meme) => (
														<Row key={meme.id} item={meme}>
															<Cell>
																{" "}
																<Image
																	src={CDNmeme + "/" + meme.image_src}
																	width={150}
																	height={150}
																	alt={meme.name}
																/>
															</Cell>
															<Cell>{meme.name}</Cell>
															<Cell>
																{" "}
																<button
																	className='btn btn-memes'
																	onClick={() =>
																		deleteMeme(meme.image_src, meme.id)
																	}
																>
																	Delete this meme
																</button>
															</Cell>
														</Row>
													))}
												</Body>
											</>
										)}
									</Table>
									<div
										className='pagination'
										style={{ display: "flex", justifyContent: "space-between" }}
									>
										<span>
											Total Pages: {pagination.state.getTotalPages(data.nodes)}
										</span>

										<span className='paginated'>
											Page:{" "}
											{pagination.state.getPages(data.nodes).map((_, index) => (
												<button
													key={index}
													type='button'
													style={{
														fontWeight:
															pagination.state.page === index
																? "bold"
																: "normal",
													}}
													onClick={() => pagination.fns.onSetPage(index)}
												>
													{index + 1}
												</button>
											))}
										</span>
									</div>
								</>
							) : (
								<h4 className='text-center'>
									You have no memes yet, add some, don&apos;t be shy!
								</h4>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Login;
