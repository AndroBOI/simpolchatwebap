import { Spinner } from "./ui/spinner";

const LoadingSpinner = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner className="size-8" />
    </div>
  );
};

export default LoadingSpinner;
