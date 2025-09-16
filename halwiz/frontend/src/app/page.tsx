import Image from "next/image";
import Slider from "@/components/Slider";
import Products from "./products/page";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  
  
  return (
    
    <>
      <Slider/>
      <Products/>
      <div className="mt-10">
        <img src="https://desitesi.com/wp-content/uploads/2025/07/Pick-Your-Favorite-Thekua-scaled.png" alt="" />
      </div>
      {/* <Testimonial /> */}
      <Testimonials/>
    </>


    
  );
}
