import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginBtn = ({ onSuccess, onError, auth,size }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (tokenResponse.access_token) {
          const { data } = await axios.post(
            "/api/middleware/linkEmail",
            {
              g_access_token: tokenResponse.access_token,
            },
            { headers: { token: auth } }
          );
          if (data.code == 200) {
            onSuccess({ email: data?.data?.updateData?.email });
          } else if (data.code == 412 && data?.data?.errors) {
            onError(data?.data?.errors[0].g_access_token);
          } else if (data.code == 409 || data.code == 417) {
            onError(data?.message);
          } else {
            onError("SomeThing Went wrong");
          }
        }
      } catch (err) {
        console.log("err", err);
        onError("SomeThing Went wrong");
      }
    },
    onError: (error) => {
      console.log(error);
      onError("SomeThing Went wrong");
    },
  });
  return (
    <>
      {size == "small" ? (
        <button className="s_logo" onClick={() => login()}>
          {/* <span>Sign in with Google</span> */}
          <svg><use href="./sprite.svg#google"></use></svg>

        </button>
      ) : (
        <button className="l_logo" onClick={() => login()}>
          <span>गूगल से लॉगइन करें</span>
          <svg>
            <use href="/sprite.svg#google"></use>
          </svg>
        </button>
      )}
      <style jsx>{`
        .l_logo {
          background-color: white;
          display: flex;
          align-items: center;
          border: 1px solid black;
          cursor: pointer;
          width: 100%;
          padding: 0 20px;
          height: 34px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .s_logo {
           background-color: transparent;
          display: flex;
          align-items: center;
          border: 1px solid black;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
       .l_logo span {
          
          font-size: 12px !important;
          font-weight: 400 !important;
          color: black;
        }
        .l_logo svg {
          width: 18px;
          height: 18px;
          margin-left: 5px;
        }
        .s_logo svg{
          width:18px;
          height:18px;
        }
      `}</style>
    </>
  );
};
export default GoogleLoginBtn;
