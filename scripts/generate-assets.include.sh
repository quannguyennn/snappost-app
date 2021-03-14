
input=$PWD/$1

size=$2

output=$3

if [ -z "$output" ] ; then
  output=$(basename $input)
fi

output=${output/%.png/}
output=${output/%.jpg/}
output=${output/%.jpeg/}
output=${output/%.svg/}

FORMAT=$(identify -format '%m' "$input")

WIDTH=$(identify -format '%w' "$input")
HEIGHT=$(identify -format '%h' "$input")
DENSITY=$(identify -format '%[resolution.x]' "$input")

if [ "$FORMAT" = 'SVG' ] ; then
  DENSITY=96
fi

# width=
# height=
# density=

function preapre_image () {

  if [ -n "$size" ] ; then

    [ -z "$width" ] && width=${size/x*/}
    [ -z "$height" ] && height=${size/*x/}

    if [ -z "$width" ] && [ -z "$height" ] ; then
      width=$WIDTH
      height=$HEIGHT
    elif [ -z "$width" ] ; then
      width=$(echo $WIDTH*$height/$HEIGHT | bc)
    elif [ -n "$width" ] ; then
      height=$(echo $HEIGHT*$width/$WIDTH | bc)
    fi

  else

    [ -z "$width" ] && width=$WIDTH
    [ -z "$height" ] && height=$HEIGHT

  fi

  density=$(echo $DENSITY*$width/$WIDTH | bc)

  echo "$FORMAT ${WIDTH}x${HEIGHT}:${DENSITY} => PNG ${width}x${height}:${density}@${scale} |> $(image_path)"

}

function image_path () {
  echo "$PWD/assets/output.png";
}

function generate_image () {
  preapre_image
  mogrify -write $(image_path) -format png -background none -density "$(echo $density*$scale | bc)" -resize "$(echo $width*$scale | bc)x$(echo $height*$scale | bc)" "$input"
}
