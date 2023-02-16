import { expect, test } from '@playwright/test';
import { Donator } from "../src/lib/ts/donator.js"
import { Charity } from "../src/lib/ts/charity.js"
import { Parameter } from "../src/lib/ts/parameter.js"

let tries: number = 100;
let normal_charity: Charity = new Charity("Normal", 1, 0, false, true, false, 0, 0, 0, 0.5);
let risky_charity: Charity = new Charity("Risky",1,0,true,false,false,0.1,0,0,0);
let params: Parameter = new Parameter();

// Sehr Risikohafte Menschen nutzen lieber Aktions-Lotterien
// Reiche Menschen spenden lieber ohne return
//     Weil sie nicht darauf angewiesen sind
//     Weil das evtl. unpopulärer ist
// Menschen benutzen social Media um Charities zu bewerben
// Menschen mit weniger als 10 Followern teilen keine Charities
// Reiche Menschen kennen eher reiche Menschen
// Bekannte Menschen kennen eher Bekannte Menschen
// Nur ein kleiner Anteil an Menschen sucht aktiv nach Möglichkeiten zu spenden, sondern spenden, wenn sie aufgefordert werden

test('Verschuldete Menschen spenden nicht', async () => {
	let person_in_dept_donated: boolean = false;
	for (var i: number = 0; i < tries; i++) {
		var donator: Donator = new Donator(params);
		var donation_amount = donator.getDonationAmount(normal_charity);

		if (donation_amount > 0 && donator.getWealth() < 0) {
			person_in_dept_donated = true;
			break;
		}
	}
	await expect(person_in_dept_donated).toBe(false);
});

test('Niemand spendet mehr als 20% seines Vermögens', async () => {
	let person_donated_more_than_20_percent_wealth: boolean = false;
	for (var i: number = 0; i < tries; i++) {
		var donator: Donator = new Donator(params);
		var donation_amount = donator.getDonationAmount(normal_charity);

		if (donation_amount > 0.2 * donator.getWealth()) {
			person_donated_more_than_20_percent_wealth = true;
			break;
		}
	}
	await expect(person_donated_more_than_20_percent_wealth).toBe(false);
});


test('Reiche Menschen spenden mehr', async () => {
	let richer_person_spent_less: number = 0;
	for (var i: number = 0; i < tries; i++) {
		var donator: Donator = new Donator(params);
		var richer_donater = donator;

		richer_donater.setWealth(donator.getWealth() * ((donator.getWealth() > 0) ? 2 : 0.5));

		if (richer_donater.getDonationAmount(normal_charity) < donator.getDonationAmount(normal_charity)) {
			richer_person_spent_less += 1;
			break;
		}
	}
	await expect(richer_person_spent_less).toBeLessThanOrEqual(10);
});


test('Bekannte Meschen sind meistens reicher', async () => {
	let divide = Donator.calculatePopularity(0.5);

	let famous_avg_money: number = 0;
	let not_famous_avg_money: number = 0;

	let famous_amount: number = 0;
	let not_famous_amount: number = 0;
	for (var i: number = 0; i < 2 * tries; i++) {
		var donator: Donator = new Donator(params);

		if (donator.getPopularity() > divide) 
		{
			famous_amount += 1;
			famous_avg_money += donator.getWealth();
		}
		else
		{
			not_famous_amount += 1;
			not_famous_avg_money += donator.getWealth();
		}
	}
	await expect(famous_avg_money / famous_amount).toBeGreaterThan(not_famous_avg_money / not_famous_amount);
});


// test('Risikoarme Menschen spenden weniger, wenn das Geld für Zweckfremde Zwecke ausgegeben wird', async () => {
// 	let richer_person_spent_less: number = 1;

// 	for (var i: number = 0; i < tries; i++) {
// 		var donator: Donator = new Donator(params);
// 		var richer_donater = donator;

// 		richer_donater.setWealth(donator.getWealth() * ((donator.getWealth() > 0) ? 2 : 0.5));

// 		if (richer_donater.getDonationAmount(normal_charity) < donator.getDonationAmount(normal_charity)) {
// 			richer_person_spent_less += 1;
// 			break;
// 		}
// 	}
// 	await expect(richer_person_spent_less).toBeLessThanOrEqual(10);
// });