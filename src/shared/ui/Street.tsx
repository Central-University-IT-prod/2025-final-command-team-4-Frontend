import { IoIosNavigate } from "react-icons/io"

interface StreetProps {
    location: string | undefined
}

export const Street = ({location}: StreetProps) => {
    return (
        <p className='flex items-center gap-1 px-2 rounded-md'>
            <IoIosNavigate fontSize={20} />
            <span className='text-sm font-medium'>
                {location}
            </span>
        </p>
    )
}