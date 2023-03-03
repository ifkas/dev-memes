import { Inconsolata } from "@next/font/google";
const inconsolata = Inconsolata({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
});
const Features = () => {
	return (
		<div className='features container'>
			<div className={inconsolata.className}>
				<div className='col col-8'>
					<h3 className='text-center'>Upcoming features</h3>
					<h5 className='text-center'>in vers 0.2</h5>
					<ul>
						<li>
							{" "}
							<strong className='ap'>Front page:</strong> Social sharing of
							images within the lightbox.
						</li>
						<li>
							{" "}
							<strong className='ap'>Front page:</strong>{" "}
							<strike>
								Infinite scroll on homepage with lazy loading, fetch new data
								only when{" "}
							</strike>
							<span className='list-pad' scrolled>
								<strike>user to bottom.</strike>
							</span>
						</li>
						<li>
							{" "}
							<strong className='ap'>Front page:</strong>{" "}
							<strike>
								New skin (I will make miami vice syntwave skin - light one,
								excited).
							</strike>{" "}
							😀
						</li>
						<li>
							<strong className='ap'>Front page:</strong>{" "}
							<strike>Animation smoothing for certain parts</strike>
						</li>
						<br />
						<hr></hr>
						<br />
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Only one user admin
							can delete the photos.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong>{" "}
							<strike>
								Add notifications after deleting or adding memes (bottom right
								corner).
							</strike>
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Add alert before
							deleting meme.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> User details page, can
							have it&apos;s own avatar, username too.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Each user can have
							it&apos;s own space where all his uploaded memes will show{" "}
							<span className='list-pad'>
								plus option to list all memes but without delete option for
								those.
							</span>
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Option to reorder the
							memes by sortBy.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Better file upload
							system with progress bar, like dropzone, etc.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong> Custom greeting
							message for the user.
						</li>
						<li>
							{" "}
							<strong className='fp'>Admin page:</strong>{" "}
							<strike>
								Search meme by UUID (if needs one meme to be deleted and easy to
								be found).
							</strike>
						</li>
						<br />
						<hr></hr>
						<br />
						<li>
							{" "}
							<strong className='gp'>Global:</strong>{" "}
							<strike>Better error handling.</strike>
						</li>
						<li>
							<strong className='gp'>Global:</strong> Optimization and caching
							of images (now is option only if Supabase premium plan).
						</li>
						<br />
						<li>
							{" "}
							<strong className='ip'>Idea:</strong> Each user can have it&apos;s
							own frontend dedicated page where all his memes are displayed and
							that can share later on that page with anyone? Like his personal
							meme page?
						</li>
					</ul>
					<p className='text-right'>Ivo Culic - dev-memes.com</p>
				</div>
			</div>
		</div>
	);
};

export default Features;
