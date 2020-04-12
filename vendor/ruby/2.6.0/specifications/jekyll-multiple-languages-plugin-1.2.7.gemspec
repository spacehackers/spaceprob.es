# -*- encoding: utf-8 -*-
# stub: jekyll-multiple-languages-plugin 1.2.7 ruby lib

Gem::Specification.new do |s|
  s.name = "jekyll-multiple-languages-plugin".freeze
  s.version = "1.2.7"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Martin Kurtsson".freeze]
  s.date = "2014-12-29"
  s.description = "Plugin for Jekyll and Octopress that adds support for translated keys, templates and posts.".freeze
  s.email = ["martin.kurtsson@screeninteraction.com".freeze]
  s.homepage = "https://github.com/screeninteraction/jekyll-multiple-languages-plugin/".freeze
  s.licenses = ["MPL2".freeze]
  s.rubygems_version = "3.0.1".freeze
  s.summary = "I18n plugin for Jekyll and Octopress".freeze

  s.installed_by_version = "3.0.1" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.3"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 0"])
    else
      s.add_dependency(%q<bundler>.freeze, ["~> 1.3"])
      s.add_dependency(%q<rake>.freeze, ["~> 0"])
    end
  else
    s.add_dependency(%q<bundler>.freeze, ["~> 1.3"])
    s.add_dependency(%q<rake>.freeze, ["~> 0"])
  end
end
