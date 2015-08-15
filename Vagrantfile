Vagrant.configure("2") do |config|

    hostname = "pulsesonos.box"
    locale = "de_DE.UTF-8"

    # Box
    config.vm.box = "ubuntu/trusty64"
    config.vm.hostname = hostname

    # Shared folders
    config.vm.synced_folder ".", "/srv"

    config.vm.provider :virtualbox do |vb|
        vb.customize [
          "modifyvm", :id,
          "--memory", "512",
        ]
      end

    # Setup
    config.vm.provision :shell, :inline => "touch .hushlogin"
    config.vm.provision :shell, :inline => "hostnamectl set-hostname #{hostname} && locale-gen #{locale}"
    config.vm.provision :shell, :inline => "apt-get update --fix-missing"
    config.vm.provision :shell, :inline => "apt-get install -q -y g++ make git curl vim"

    # Lang
    config.vm.provision :shell, :inline => "add-apt-repository ppa:chris-lea/node.js && apt-get update"
    config.vm.provision :shell, :inline => "apt-get install -q -y nodejs"
    config.vm.provision :shell, :inline => "apt-get install -q -y libpulse-dev libpulse0 pulseaudio-module-bluetooth pulseaudio pulseaudio-utils"
end