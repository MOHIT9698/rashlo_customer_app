import { Link, RelativePathString } from 'expo-router'
import { View } from 'react-native'
import { BackIcon } from '../../constants/Icons'

interface ButtonProps {
    link: RelativePathString | any
}

const BackButton = ({ link }: ButtonProps) => {
    return (
        <Link  href={link} >
            <View >
                <BackIcon size={20} />
            </View>
        </Link>
    )
}

export default BackButton