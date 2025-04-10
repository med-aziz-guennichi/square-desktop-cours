import FullPageLoader from "@/components/full-page-loader";
import { Outlet, useNavigation } from "react-router-dom";

export default function GlobalLayout() {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  return (
    <>
      {isLoading && (
        <FullPageLoader isLoading={isLoading} />
      )}
      <Outlet />
    </>
  );
}
