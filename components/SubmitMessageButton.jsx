import { useFormStatus } from "react-dom"
import { FaPaperPlane } from "react-icons/fa"

const SubmitMessageButton = () => {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center" type="submit">
            <FaPaperPlane className="mr-2"></FaPaperPlane> {pending ? "Sending..." : "Send Message"}
        </button>
    )
}

export default SubmitMessageButton
