import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import Footer from "./components/footer/Footer";

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout title={siteConfig.title} description={siteConfig.tagline}>
			<main className={styles.main}>
				<Hero />
				<Features />
				<Footer />
			</main>
		</Layout>
	);
}
