import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Bid Center",
  description: "Bid Center",
});

const BidCenterLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BidCenterLayout;
