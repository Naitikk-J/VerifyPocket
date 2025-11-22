{
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20,
    pkgs.mongodb-community,
    pkgs.nodePackages.ts-node
  ];
  idx.extensions = [
    "svelte.svelte-vscode",
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm",
          "run",
          "dev",
          "--",
          "--port",
          "$PORT",
          "--host",
          "0.0.0.0"
        ];
        manager = "web";
        env = {
          MONGODB_URI = "mongodb://localhost:27017/db";
        };
      };
      db = {
        command = [ "sh", "-c", "mkdir -p data/db && mongod --dbpath ./data/db" ];
      };
    };
  };
}
