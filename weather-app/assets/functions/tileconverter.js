export default function latLngToTile(latLng, zoom) {
  const n = Math.pow(2, zoom);
  const tileX = Math.floor(((latLng.longitude + 180) / 360) * n);
  const tileY = Math.floor(
    ((1 -
      Math.log(
        Math.tan((latLng.latitude * Math.PI) / 180) +
          1 / Math.cos((latLng.latitude * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );

  return { x: tileX, y: tileY, z: zoom };
}
