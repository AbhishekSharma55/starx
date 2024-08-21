import { DashboardNavigationMenu } from "@/components/dashboard/NavigationMenu";
import { TextGenerateEffect } from "@/components/text-generate-effect";

const dashboardPage = () => {
  return (
    <div className="flex flex-row min-h-screen justify-center items-center text-xl">
      <TextGenerateEffect words="Welcome to STARX Personal Website" />
    </div>
  );
};
export default dashboardPage;
