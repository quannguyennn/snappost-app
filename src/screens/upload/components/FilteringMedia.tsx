import React from 'react';
import { Image } from 'react-native';

import {
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
  Normal,
} from 'react-native-image-filter-kit';
import { FilterType } from '../../../components/FilterRow/type';
import useDimensions from '../../../hooks/useDimension';
export type FilteringMediaProps = {
  uri: string;
  filter?: FilterType;
  handleExtractMedia: (uri: string) => void;
};

const FilteringMedia: React.FC<FilteringMediaProps> = React.memo(({ uri, filter, handleExtractMedia }) => {
  const { windowWidth } = useDimensions();

  if (!filter || filter === FilterType.NONE)
    return <Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />;
  else
    return (
      <>
        {filter === FilterType.Normal && (
          <Normal
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}
        {filter === FilterType.Emboss && (
          <Emboss
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Earlybird && (
          <Earlybird
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.FuzzyGlass && (
          <FuzzyGlass
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Tint && (
          <Tint
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Warm && (
          <Warm
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Cool && (
          <Cool
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Saturate && (
          <Saturate
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Invert && (
          <Invert
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Nightvision && (
          <Nightvision
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Technicolor && (
          <Technicolor
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Polaroid && (
          <Polaroid
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.ToBGR && (
          <ToBGR
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Kodachrome && (
          <Kodachrome
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Browni && (
          <Browni
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Vintage && (
          <Vintage
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Lsd && (
          <Lsd
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Protanomaly && (
          <Protanomaly
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Deuteranomaly && (
          <Deuteranomaly
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Tritanomaly && (
          <Tritanomaly
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Protanopia && (
          <Protanopia
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Achromatopsia && (
          <Achromatopsia
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}

        {filter === FilterType.Achromatomaly && (
          <Achromatomaly
            onExtractImage={({ nativeEvent }) => handleExtractMedia(nativeEvent.uri)}
            extractImageEnabled={true}
            image={<Image source={{ uri }} style={{ aspectRatio: 1, width: windowWidth - 50, marginBottom: 150 }} />}
          />
        )}
      </>
    );
});

export default FilteringMedia;
