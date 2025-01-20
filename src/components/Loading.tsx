import { OrbitProgress } from "react-loading-indicators";

interface LoadingProps {
  textContent: string;
}

const Loading = ({ textContent }: LoadingProps) => {
  return (
    <>
      <OrbitProgress 
        variant="spokes" 
        color="#3182ce" 
        size="medium" 
        text=""
        textColor="" 
      />
      <p className="text-center text-2xl text-blue-600 mt-4">{textContent}</p>
    </>
  );
};

export default Loading;