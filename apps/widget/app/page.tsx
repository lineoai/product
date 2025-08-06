
import { WidgetView } from "@/modules/widget/ui/views/widget-view";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

const Page = async ({ searchParams }: Props) => {
  const { organizationId } = await searchParams;

  return <WidgetView organizationId={organizationId} />;
};
export default Page;