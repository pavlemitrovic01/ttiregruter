import type { Actor } from './access.ts';

export type PrivateAccountSeed = {
  id: string;
  userId: string;
  email: string;
  role: Actor['role'];
  fullName: string;
  alias: string;
  passwordStem: string;
  referralUrl: string | null;
  seedContacts?: boolean;
};

// Private test identities only. No driver/contact data is copied from the live app.
// Temporary passwords are derived from this roster and must be changed at first sign-in.
export const PRIVATE_ACCOUNT_SEED: PrivateAccountSeed[] = [
  { id: 'bootstrap-aleksa', userId: 'private-aleksa', email: 'cvetanovicaleksa45@gmail.com', role: 'owner', fullName: 'Aleksa Cvetanović', alias: 'Alex Jones', passwordStem: 'aleksa.cvetanovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=alex', seedContacts: true },
  { id: 'approved-john', userId: 'private-lazar', email: 'lakikiller09@gmail.com', role: 'admin', fullName: 'Lazar Jevtic', alias: 'John', passwordStem: 'lazar.jevtic', referralUrl: 'https://apply.ttirecruiting.us/?ref=john' },
  { id: 'approved-nate', userId: 'private-nate', email: 'mikicn956@gmail.com', role: 'admin', fullName: 'Nemanja Mikic', alias: 'Nate Mitchell', passwordStem: 'nate.mitchell', referralUrl: 'https://apply.ttirecruiting.us/?ref=nate-mitchell' },
  { id: 'approved-nash', userId: 'private-nash', email: 'azzinjo86@gmail.com', role: 'admin', fullName: 'Aleksandar Djordjevic', alias: 'Nash', passwordStem: 'aleksandar.djordjevic', referralUrl: 'https://apply.ttirecruiting.us/?ref=nash' },
  { id: 'approved-jacob', userId: 'private-jacob', email: 'jovanmill03@gmail.com', role: 'recruiter', fullName: 'Jovan Miladinovic', alias: 'Jacob', passwordStem: 'jovan.miladinovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=jacob' },
  { id: 'approved-mike', userId: 'private-mike', email: 'belopoljacmihailo@gmail.com', role: 'recruiter', fullName: 'Mike', alias: 'Mike', passwordStem: 'mihajlo.belopoljac', referralUrl: 'https://apply.ttirecruiting.us/?ref=mike' },
  { id: 'approved-stephan', userId: 'private-stephan', email: 'grujic.stefan114@gmail.com', role: 'recruiter', fullName: 'Stephan', alias: 'Stephan', passwordStem: 'stefan.grujic', referralUrl: 'https://apply.ttirecruiting.us/?ref=stephan' },
  { id: 'approved-samuel', userId: 'private-samuel', email: 'thesilentflame2@gmail.com', role: 'recruiter', fullName: 'Samuel', alias: 'Samuel', passwordStem: 'samuel.silentflame', referralUrl: 'https://apply.ttirecruiting.us/?ref=samuel' },
  { id: 'approved-mila', userId: 'private-mila', email: 'vuskovic.mila17@gmail.com', role: 'recruiter', fullName: 'Mila', alias: 'Mila', passwordStem: 'mila.vuskovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=mila' },
  { id: 'approved-benedeto', userId: 'private-benedeto', email: 'd.benedeto@gmail.com', role: 'recruiter', fullName: 'D. Benedeto', alias: 'Benedeto', passwordStem: 'd.benedeto', referralUrl: 'https://apply.ttirecruiting.us/?ref=benedeto' },
  { id: 'approved-damgluhovic', userId: 'private-damgluhovic', email: 'damgluhovic@gmail.com', role: 'recruiter', fullName: 'Damgluhovic', alias: 'Damgluhovic', passwordStem: 'damgluhovic.account', referralUrl: 'https://apply.ttirecruiting.us/?ref=damgluhovic' },
  { id: 'approved-marija', userId: 'private-marija', email: 'milojkov.marija2001@gmail.com', role: 'recruiter', fullName: 'Marija', alias: 'Marija', passwordStem: 'marija.milojkov', referralUrl: 'https://apply.ttirecruiting.us/?ref=marija' },
  { id: 'approved-uros', userId: 'private-uros-milovanovic', email: 'uros.milovanovic1.um@gmail.com', role: 'recruiter', fullName: 'Uros', alias: 'Uros', passwordStem: 'uros.milovanovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=uros' },
  { id: 'approved-34de3893-639a-4ade-a7ec-a2433bfaf200', userId: 'private-uros-mladenovic', email: 'urosmladenovice25@gmail.com', role: 'recruiter', fullName: 'Uros Mladenovic', alias: 'Matt Milano', passwordStem: 'uros.mladenovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=matt-milano' },
  { id: 'approved-5938b753-c498-4c8d-a52d-2f9c1b25e556', userId: 'private-marta', email: 'martatodorovic8@gmail.com', role: 'recruiter', fullName: 'Marta Todorovic', alias: 'Martha Smith', passwordStem: 'marta.todorovic', referralUrl: 'https://apply.ttirecruiting.us/?ref=martha-smith' },
  { id: 'approved-b7be1a76-02e2-468c-a979-46379f6a3d81', userId: 'private-mathew', email: 'cukce02@gmail.com', role: 'recruiter', fullName: 'Mathew Malone', alias: 'Mathew Malone', passwordStem: 'mathew.malone', referralUrl: 'https://apply.ttirecruiting.us/?ref=mathew-malone' },
  { id: 'bootstrap-tti-owner', userId: 'private-tti-owner', email: 'tticdlrecruiting@gmail.com', role: 'admin', fullName: 'TTI Recruiting', alias: 'TTI Recruiting', passwordStem: 'tti.recruiting', referralUrl: null },
];

export const privateInitialPassword = (stem: string) => `${stem}2026`;
