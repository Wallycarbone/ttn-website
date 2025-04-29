
{ pkgs }: {
  deps = [
    pkgs.zip
    pkgs.postgresql
    pkgs.unzip
    pkgs.nodejs-18_x
  ];
}
