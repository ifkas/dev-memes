import Head from "next/head";
import { Inconsolata } from "@next/font/google";
// import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";

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
	// const supabase = useSupabaseClient();
	// const supabase = supabase();
	const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];
	const memeLink = (id, width, height) =>
		`https://vvgskppmennronkqbstj.supabase.co/storage/v1/object/public/memes/38e49d24-a90a-4cf9-9825-602a6c3e1bb7/${id}`;
	const [index, setIndex] = useState(-1);

	async function getMemes() {
		const { data, error } = await supabase.storage
			.from("memes")
			.list("38e49d24-a90a-4cf9-9825-602a6c3e1bb7" + "/", {
				limit: 300,
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
		getMemes();
	}, []);

	const allMemes = memes.map((meme) => ({
		src: memeLink(meme.name),
		width: 500,
		height: 0,
		images: breakpoints.map((breakpoint) => {
			const height = Math.round((meme.height / meme.width) * breakpoint);
			return {
				src: memeLink(meme.name),
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
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<header className='devmemeslogo'></header>
			<main>
				<div>
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
				</div>
			</main>
			<footer className={inconsolata.className}>
				Currently, total of {memes.length} kick-ass funny memes.
				<br />
				<a href='https://ivo-culic.medium.com/'>- Ivo Culic -</a>
			</footer>
		</>
	);
}
