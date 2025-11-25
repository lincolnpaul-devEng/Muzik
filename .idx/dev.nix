# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.android-tools
    pkgs.android-sdk
    pkgs.nodejs_22
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];

    previews = {
      enable = true;
      previews = [{
        id = "android";
        command = [
          "nix"
          "develop"
          "--command"
          "bash"
          "-c"
          "
            set -x;
            yes | sdkmanager --licenses;
            export ADB_SERVER_SOCKET=tcp:localhost:5037;
            adb kill-server;
            adb server nospawn &;
            emulator -avd pixel_8 -no-audio -no-boot-anim -no-snapshot -no-window -gpu swiftshader_indirect -no-snapshot &
            sleep 10;
            until adb shell getprop sys.boot_completed; do sleep 1; done;
            adb reverse tcp:8081 tcp:8081;
            npm run android;
          "
        ];
        port = 8081;
        label = "Android";
        type = "embed";
      }];
    };
  };
}
