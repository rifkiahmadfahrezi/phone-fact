import { Hero } from "react-daisyui"
import { Link } from "react-router-dom"
import useAuth from "@/hooks/useAuth"

const HomePage = () => {

  const { auth } = useAuth()

  return (
    <>
      <Hero>
        <Hero.Content className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <article className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-5">Welcome to PhoneFact</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis accusamus hic, sit dolorem nam inventore dolores impedit in similique repudiandae officiis amet sunt minima quod quos perferendis laborum autem rem.</p>
                <Link to={"/phones"} className="btn btn-primary mt-5">
                  Explore
                </Link>
            </article>

            <figure className="flex-1 relative after:content-[''] after:w-full after:h-full after:z-0 after:absolute after:left-2/4 after:top-2/4 after:-translate-x-2/4 after:-translate-y-2/4 after:bg-primary/30 a after:blur-xl after:rounded-full after:scale-[.70]">
              <img 
                className="z-10 relative"
                src="/hero-image.webp" alt="hero image" />
            </figure>
        </Hero.Content>
      </Hero>

      {!auth?.token &&
        <Hero className="bg-base-200 py-10 mt-20 shadow-md">
          <Hero.Content className="text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Join Us</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
                excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
                a id nisi.
              </p>

              <Link className="btn btn-primary" to={"/register"}>Register Now</Link>
            </div>
          </Hero.Content>
      </Hero>
      }
    </>
  )
}

export default HomePage