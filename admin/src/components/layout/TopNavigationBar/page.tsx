"use client";
import LogoBox from "@/components/LogoBox";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

import Notifications from "./components/Notifications";
import ThemeCustomizeToggle from "@/components/ThemeCustomizeToggle";
import ThemeModeToggle from "./components/ThemeModeToggle";
import ProfileDropdown from "./components/ProfileDropdown";
import { Suspense } from "react";
import LeftSideBarToggle from "./components/LeftSideBarToggle";

import HorizontalToggle from "./components/HorizontalToggle";

const TopNavigationBar = () => {
  return (
    <header className="app-topbar">
      <div className="page-container topbar-menu">
        <div className="d-flex align-items-center gap-2">
          <LogoBox />
          <LeftSideBarToggle />

          <HorizontalToggle />
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="topbar-item d-flex d-xl-none">
            <button
              className="topbar-link"
              data-bs-toggle="modal"
              data-bs-target="#searchModal"
              type="button"
            >
              <IconifyIcon icon="tabler:search" className="fs-22" />
            </button>
          </div>

          <Notifications />

          {/* <ThemeCustomizeToggle />
          <ThemeModeToggle /> */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;
