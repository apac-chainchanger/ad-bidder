import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Slot Creator",
  description: "Slot Creator",
});

const SlotCreatorLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SlotCreatorLayout;
