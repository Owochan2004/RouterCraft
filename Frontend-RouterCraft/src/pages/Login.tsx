import * as Yup from "yup";
import { ApiInstance } from "../Services/Api";
import { Formik } from "formik";
import Input from "../components/input/InputLabel";
import Button from "../components/button/InputButton";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const response = await ApiInstance.post("/auth/login", values);
      console.log(response.data);

      // Guarda el token en localStorage
      if (response.data.token) {
        localStorage.setItem("jwtToken", response.data.token);
      }
    } catch (error: any) {
      if (error.response) {
        const response = error.response.data;
        console.log(response);
      }
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(5, "La contraseña tiene que tener más de 5 dígitos")
      .required("La contraseña es obligatoria"),
  });

  return (
    <section className="container bg-slate-500 h-full min-h-screen grid grid-cols-1 sm:grid-cols-2 content-center">
      <div className="w-full h-full flex">
        <img className="items-center" src="src/assets/login.jpg" alt="login" />
      </div>
      <div className="w-full mx-auto my-auto py-[15%] max-w-[60%]">
        <div className="grid grid-cols-1 gap-6 content-center h-full p-5 ">
          <div className="max-w-md w-full space-y-8 m-auto">
            <div className="py-2 my-4">
              <h2 className="text-3xl font-bold text-center text-white">
                Login
              </h2>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  <Input
                    label="Correo"
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    error={errors.email}
                    onChange={handleChange}
                    value={values.email}
                  />
                  <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    placeholder="**************"
                    error={errors.password}
                    onChange={handleChange}
                    value={values.password}
                  />

                  <Button type="submit" value="Registrar" />
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
