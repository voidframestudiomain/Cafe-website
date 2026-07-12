import { getSignatures } from "@/lib/cafe/data";
import HomeStory from "@/components/story/HomeStory";

const SIGNATURE_IMAGES = [
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80",
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80",
];

export default async function HomePage() {
  const signatures = (await getSignatures(5)).map((dish, i) => ({
    ...dish,
    image: SIGNATURE_IMAGES[i % SIGNATURE_IMAGES.length],
  }));

  return <HomeStory signatures={signatures} />;
}
