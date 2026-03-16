import Image from "next/image";
import { useGetSettingsQuery } from "@/app/redux/api/settings/settingsApi";
const LogoBox = () => {
  const { data, isLoading, error } = useGetSettingsQuery(undefined);
  if (isLoading) {
    return (
      <a href="/" className="logo">
        <span className="logo-dark">
          <span className="logo-lg">
            <div
              className="placeholder-glow"
              style={{ width: "50px", height: "22px" }}
            >
              <span className="placeholder w-100 h-100 rounded" />
            </div>
          </span>
        </span>
      </a>
    );
  }
  if (error) {
    return (
      <a href="/" className="logo">
        <span className="logo-dark">
          <span className="logo-lg fw-bold text-primary">HeavenHoliday</span>
        </span>
      </a>
    );
  }
  return (
    <a href="/" className="logo">
      <span className="logo-dark">
        <span className="logo-lg">
          <Image
            width={109}
            height={22}
            src={data?.data?.companyLogo}
            alt="dark logo"
            style={{ width: "50px" }}
          />
        </span>
        <span className="logo-sm">
          <Image
            width={19}
            height={24}
            src={data?.data?.companyLogo}
            alt="small logo"
          />
        </span>
      </span>
    </a>
  );
};

export default LogoBox;
