import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import LatestProducts from "@/components/TopProducts/TopProducts";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Banner />
        <LatestProducts />
      </div>
      <Footer />
    </div>
  );
}
