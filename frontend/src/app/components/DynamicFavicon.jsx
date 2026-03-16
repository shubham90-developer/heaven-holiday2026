"use client";
import { useEffect } from "react";
import { useGetSettingsQuery } from "store/settings/settingsApi";

const DynamicFavicon = () => {
  const { data: general } = useGetSettingsQuery();
  const generalSettings = general?.data || {};

  useEffect(() => {
    if (!generalSettings?.favicon) return;

    const setFavicon = (url) => {
      let link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/png";
      link.rel = "icon";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    };

    setFavicon(generalSettings.favicon);
  }, [generalSettings?.favicon]);

  return null;
};

export default DynamicFavicon;
