import { Inter } from "@next/font/google";
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

// https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/c33a1a4b-e60b-4637-aeba-c329493955b3/031ee747-2ef2-419d-a630-7c870cb49f52
// URL of the CDN + user.id + uuid image name
const CDNmeme =
	"https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/";

const inter = Inter({ subsets: ["latin"] });

const Login = () => {
	const theme = useTheme(getTheme());
	const session = useSession();
	const supabase = useSupabaseClient();
	const user = useUser();
	const [memes, setMemes] = useState([]);
	const data = { nodes: memes };
	// console.log(data);

	async function getMemes(pagination) {
		const { data, error } = await supabase.storage
			.from("memes")
			.list(user?.id + "/", {
				limit: 100,
				offset: 0,
				sortBy: { column: "name", order: "asc" },
			});

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
			size: 10,
		},
	});

	// console.log(data);
	// console.log(memes.length);

	async function uploadMeme(e) {
		let meme = e.target.files[0];
		// upload only to the folder of the user that actually uploaded the meme
		// use the user id so we differentiate the memes with the same name, generate random ID
		const { data, error } = await supabase.storage
			.from("memes")
			.upload(user.id + "/" + uuidv4(), meme);
		// .upload("memess" + "/" + uuidv4(), meme);

		if (data) {
			getMemes();
		} else {
			console.log(error);
		}
	}

	async function deleteMeme(memeName) {
		const { error } = await supabase.storage
			.from("memes")
			.remove([user.id + "/" + memeName]);

		if (error) {
			alert(error);
		} else {
			getMemes();
		}
	}

	return (
		<div className='container logged ' style={{ padding: "50px 0 100px 0" }}>
			<div className={inter.className}>
				{!session ? (
					<>
						<div className='logo'></div>
						<div className='row'>
							<div className='six columns text-center'>
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
						<div className='logo'></div>
						<h5>Hi {user.email}</h5>
						<button onClick={() => supabase.auth.signOut()}>Sign out</button>
						{/* Here I want to pass random cool greeting, like Hi email you meme uploader, etc */}
						{/* <p>Upload new meme here:</p> */}
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
								<h5>All memes:</h5>
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
																src={CDNmeme + user.id + "/" + meme.name}
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
																onClick={() => deleteMeme(meme.name)}
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
														pagination.state.page === index ? "bold" : "normal",
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
	);
};

export default Login;
