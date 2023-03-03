import Head from "next/head";
import { Inconsolata } from "@next/font/google";
// import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useCallback } from "react";
import PhotoAlbum from "react-photo-album";
import InfiniteScroll from "react-infinite-scroll-component";

// import photos from "./photos";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { supabase } from "../lib/supabase";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";

const inconsolata = Inconsolata({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
});

export default function Home() {
	const [memes, setMemes] = useState([]);
	const [isLightMode, setLightMode] = useState(false);
	const [more, setMore] = useState(true);
	const [total, setTotal] = useState(0);

	const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

	const memeLink = (id) =>
		// `https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/38e49d24-a90a-4cf9-9825-602a6c3e1bb7/${id}`;
		`https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/${id}`;

	const [index, setIndex] = useState(-1);

	const toggleDarkMode = () => {
		setLightMode(!isLightMode);
		window.localStorage.setItem("theme", !isLightMode);
		// console.log(window.localStorage.getItem("theme"));
	};

	async function getMemes(range = 1) {
		const { count } = await supabase
			.from("memes")
			.select("*", { count: "exact", head: true });

		setTotal(count);

		if (count == memes.length) {
			setMore(false);
		}

		let fixed = 7;

		const { data, error } = await supabase
			.from("memes")
			.select()
			.range(0, fixed + range)
			// .limit(range + 2)
			.order("id", { ascending: true });

		if (data !== null) {
			setTimeout(() => {
				setMemes(data);
			}, 1000);
		} else {
			alert("Error loading memes");
		}
	}

	useEffect(() => {
		window.localStorage.getItem("theme") == "true"
			? (setLightMode(true), window.localStorage.setItem("theme", true))
			: (setLightMode(false), window.localStorage.setItem("theme", false));

		getMemes();
	}, []);

	const allMemes = memes.map((meme) => ({
		src: memeLink(meme.image_src),
		width: 500,
		height: 0,
		images: breakpoints.map((breakpoint) => {
			const height = Math.round((meme.height / meme.width) * breakpoint);
			return {
				src: memeLink(meme.image_src),
				width: breakpoint,
				height,
			};
		}),
	}));

	const slides = allMemes.map(({ src, width, height, images }) => ({
		src,
		width,
		height,
		srcSet: images.map((image) => ({
			src: image.src,
			width: 100 + "%",
			height: 100 + "%",
		})),
	}));

	return (
		<>
			<Head>
				<title>Developer memes - fun time for devs</title>
				<meta name='description' content='Funny memes for tech developers' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={isLightMode ? "light" : ""}>
				<header className='devmemeslogo'>
					<button className='button changer' onClick={toggleDarkMode}>
						{isLightMode ? "Synth night" : "Miami night"}
					</button>
				</header>
				<main>
					<div className={inconsolata.className}>
						<InfiniteScroll
							dataLength={memes.length}
							next={() => {
								getMemes(memes.length);
							}}
							hasMore={more}
							loader={
								<h4 className={`loader __className_1e0407`}>Loading...</h4>
							}
							endMessage={
								<h4
									className={`__className_1e0407`}
									style={{ textAlign: "center", marginTop: "50px" }}
								>
									Yay! You have seen all of the memes! Come back later for more!
								</h4>
							}
						>
							<PhotoAlbum
								layout='masonry'
								photos={allMemes}
								spacing='30'
								onClick={({ index }) => setIndex(index)}
							/>
							<Lightbox
								slides={slides}
								open={index >= 0}
								index={index}
								close={() => setIndex(-1)}
								// enable optional lightbox plugins
								plugins={[Fullscreen, Slideshow]}
							/>
						</InfiniteScroll>
					</div>
				</main>
				<footer className={inconsolata.className}>
					Currently, total of {total} kick-ass funny memes.
					<br />
					<a href='https://ivo-culic.medium.com/'>- Ivo Culic -</a>
				</footer>
			</div>
		</>
	);
}
