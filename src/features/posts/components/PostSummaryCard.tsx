import type {
  ComponentProps,
} from 'react';

import {
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';



type IconName =
  ComponentProps<
    typeof Ionicons
  >['name'];



type Props = {
  title:string;
  value:number;
  icon:IconName;
  iconColor:string;
  iconBackground:string;
};



export function PostSummaryCard({
  title,
  value,
  icon,
  iconColor,
  iconBackground,
}:Props){


  return (

    <View
      className="
      w-[48.5%]
      rounded-2xl
      border
      border-borderSoft
      bg-white
      p-4
      "
    >


      <View

        style={{
          backgroundColor:
            iconBackground,
        }}

        className="
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        "

      >

        <Ionicons
          name={icon}
          size={23}
          color={iconColor}
        />

      </View>



      <Text className="mt-4 text-2xl font-black text-textMain">

        {value.toLocaleString()}

      </Text>



      <Text className="mt-1 text-sm font-semibold text-textMuted">

        {title}

      </Text>


    </View>

  );

}