import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/loading-spinner.png"
        alt="Loading..."
        width={64}
        height={64}
        className="animate-spin" />
    </div>
  );
};

export default LoadingSpinner;