import React from 'react';
import { Image, ScrollView, StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import {
  Normal,
  Emboss,
  Earlybird,
  FuzzyGlass,
  Tint,
  Warm,
  Cool,
  Saturate,
  Invert,
  Nightvision,
  Technicolor,
  Polaroid,
  ToBGR,
  Kodachrome,
  Browni,
  Vintage,
  Lsd,
  Protanomaly,
  Deuteranomaly,
  Tritanomaly,
  Protanopia,
  Achromatopsia,
  Achromatomaly,
} from 'react-native-image-filter-kit';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { FilterType } from './type';
type FilterRowProps = {
  uri: string;
  onChoseFilter: (type: FilterType) => void;
  style: StyleProp<ViewStyle>;
};

const FilterRow: React.FC<FilterRowProps> = React.memo(({ uri, onChoseFilter, style }) => {
  const theme = useRecoilValue(themeState);

  return (
    <ScrollView horizontal style={style}>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Normal)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Normal</Text>
        <Normal
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Cool)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Cool</Text>
        <Cool
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Warm)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Warm</Text>
        <Warm
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Vintage)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Vintage</Text>
        <Vintage
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Tint)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Tint</Text>
        <Tint
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Saturate)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Saturate</Text>
        <Saturate
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Invert)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Invert</Text>
        <Invert
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Nightvision)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Nightvision</Text>
        <Nightvision
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Technicolor)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Technicolor</Text>
        <Technicolor
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Polaroid)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Polaroid</Text>
        <Polaroid
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.ToBGR)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>ToBGR</Text>
        <ToBGR
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Kodachrome)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Kodachrome</Text>
        <Kodachrome
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Browni)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Browni</Text>
        <Browni
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Lsd)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Lsd</Text>
        <Lsd
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Protanomaly)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Protanomaly</Text>
        <Protanomaly
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Deuteranomaly)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Deuteranomaly</Text>
        <Deuteranomaly
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Tritanomaly)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Tritanomaly</Text>
        <Tritanomaly
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Protanopia)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Protanopia</Text>
        <Protanopia
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Achromatopsia)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Achromatopsia</Text>
        <Achromatopsia
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Achromatomaly)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Achromatomaly</Text>
        <Achromatomaly
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Emboss)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Emboss</Text>
        <Emboss
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.Earlybird)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>Earlybird</Text>
        <Earlybird
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChoseFilter(FilterType.FuzzyGlass)}>
        <Text style={{ color: theme.text01, fontWeight: '700', textAlign: 'center', fontSize: 15 }}>FuzzyGlass</Text>
        <FuzzyGlass
          extractImageEnabled={true}
          image={<Image style={{ height: 130, width: 130, marginRight: 14 }} source={{ uri }} />}
        />
      </TouchableOpacity>
    </ScrollView>
  );
});

export default FilterRow;
