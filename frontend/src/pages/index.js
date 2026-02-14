import Head from "next/head";
import { useRouter } from "next/router";
import Userlayout from "@/layout/userLayout";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>LinkedIn Clone</title>
        <meta name="description" content="LinkedIn Clone Homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Userlayout>
        <div className="container my-5 py-5">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
                Connect with Friends <br /> Without Exaggeration
              </h1>
              <p className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
                A true media platform, with stories — no bluffs!
              </p>
              <button
                className="btn btn-primary px-4 py-2 fw-semibold"
                style={{ fontSize: "16px", backgroundColor: "#0a66c2", border: "none" }}
                onClick={() => router.push("/login")}
              >
                Join Now
              </button>
            </div>
            <div className="col-12 col-md-6">
              <img
                src="/Images/banner1.png"
                alt="Hero Banner"
                className="img-fluid rounded"
                style={{ maxHeight: "450px", objectFit: "cover", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </Userlayout>
    </>
  );
}
