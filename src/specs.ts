import yaml from 'js-yaml';
import mainRaw from '../specs/main.yaml?raw';
import homepageRaw from '../specs/homepage.yaml?raw';
import roboticsRaw from '../specs/robotics_projects.yaml?raw';
import softwareRaw from '../specs/software_projects.yaml?raw';
import designRaw from '../specs/design_projects.yaml?raw';
import aboutRaw from '../specs/about.yaml?raw';
import contactRaw from '../specs/contact.yaml?raw';
import type { Dict, SiteSpec } from './types';

const parse = (source: string) => yaml.load(source) as Dict;

export const mainSpec = parse(mainRaw) as SiteSpec;

export const pageSpecs: Dict = {
  homepage: parse(homepageRaw).homepage,
  robotics_projects: parse(roboticsRaw).robotics_projects,
  software_projects: parse(softwareRaw).software_projects,
  design_projects: parse(designRaw).design_projects,
  about: parse(aboutRaw).about,
  contact: parse(contactRaw).contact,
};
