import NewQuestion from "../components/homePageComponents/NewQuestion";
import Posts from "../components/homePageComponents/Posts";
const Home = () => {
  return (
    <>
      <div className="flex justify-center">
        <div className="w-[100%] md:w-[50%] px-4">
          <NewQuestion />
          <div className="w-full">
            <section className="text-white">
              
              <Posts />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
