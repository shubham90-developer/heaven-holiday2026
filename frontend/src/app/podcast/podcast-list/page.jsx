import PodcastAllList from "@/app/pages/PodcastAllList/PodcastAllList";
import React from "react";

export const metadata = {
  title: "Podcast List- Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const PodcastListPage = () => {
  return (
    <>
      <PodcastAllList />
    </>
  );
};

export default PodcastListPage;
