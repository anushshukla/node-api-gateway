import dotenv from "dotenv";

export default () => {
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
};
