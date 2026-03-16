"use client";

import { useEffect } from "react";
import { useGetSettingsQuery } from "@/app/redux/api/settings/settingsApi";

const DynamicFavicon: React.FC = () => {
  const { data: general } = useGetSettingsQuery(undefined);
  const generalSettings = general?.data;

  useEffect(() => {
    if (!generalSettings?.favicon) return;

    const setFavicon = (url: string) => {
      let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        document.head.appendChild(link);
      }

      link.href = url;
    };

    setFavicon(generalSettings.favicon);
  }, [generalSettings?.favicon]);

  return null;
};

export default DynamicFavicon;
