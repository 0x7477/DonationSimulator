import { expect, test } from '@playwright/test';
import {Statistics} from  "../src/lib/ts/statistics.js"
import {Donator} from  "../src/lib/ts/donator.js"
import {Charity} from  "../src/lib/ts/charity.js"
import {Parameter} from  "../src/lib/ts/parameter.js"

let tries:number = 100;
let unicef:Charity = new Charity("Unicef",1,0,false,true,false,0,0,0,0.5);
let params:Parameter = new Parameter();

// Reiche Menschen haben meistens mehr Reichweite (Bekanntheit, Werbung etc.)
// Bekannte Meschen sind meistens reicher
// Risikoarme Menschen schreckt es ab mit Geld zu "spielen", dass für hilfsbedürftige Menschen gedacht ist
// Sehr Risikohafte Menschen nutzen lieber Aktions-Lotterien
// Reiche Menschen spenden lieber ohne return
//     Weil sie nicht darauf angewiesen sind
//     Weil das evtl. unpopulärer ist
// Menschen benutzen social Media um Charities zu bewerben
// Menschen mit weniger als 10 Followern teilen keine Charities
// Reiche Menschen kennen eher reiche Menschen
// Bekannte Menschen kennen eher Bekannte Menschen
// Nur ein kleiner Anteil an Menschen sucht aktiv nach Möglichkeiten zu spenden, sondern spenden, wenn sie aufgefordert werden

test('Verschuldete Menschen spenden nicht', async () => 
{
	let person_in_dept_donated:boolean = false;
	for(var i:number = 0; i < tries; i++)
	{
		var donator:Donator = new Donator(params);
		var donation_amount = donator.getAmountDonated(unicef);

		if(donation_amount > 0 && donator.getWealth() < 0)
		{
			person_in_dept_donated = true;
			break;
		}
	}
	await expect(person_in_dept_donated).toBe(false);
});

test('Niemand spendet mehr als 20% seines Vermögens', async () => 
{
	let person_donated_more_than_20_percent_wealth:boolean = false;
	for(var i:number = 0; i < tries; i++)
	{
		var donator:Donator = new Donator(params);
		var donation_amount = donator.getAmountDonated(unicef);

		if(donation_amount >0.2* donator.getWealth())
		{
			person_donated_more_than_20_percent_wealth = true;
			break;
		}
	}
	await expect(person_donated_more_than_20_percent_wealth).toBe(false);
});


test('Reiche Menschen spenden mehr', async () => 
{
	let richer_person_spent_less:boolean = false;
	for(var i:number = 0; i < tries; i++)
	{
		var donator:Donator = new Donator(params);
		var richer_donater = donator;

		richer_donater.setWealth(donator.getWealth() * ((donator.getWealth() > 0)? 2:0.5));

		if(richer_donater.getAmountDonated(unicef) <  donator.getAmountDonated(unicef))
		{
			richer_person_spent_less = true;
			break;
		}
	}
	await expect(richer_person_spent_less).toBe(false);
});


test('Populäre Menschen erreichen mehr Menschen', async () => 
{
	let popular_people_reach_less_people:boolean = false;
	for(var i:number = 0; i < tries; i++)
	{
		var donator:Donator = new Donator(params);
		var popularer_donater = donator;

		popularer_donater.setWealth(donator.getWealth() * ((donator.getWealth() > 0)? 2:0.5));

		if(popularer_donater.get <  donator.getAmountDonated(unicef))
		{
			popular_people_reach_less_people = true;
			break;
		}
	}
	await expect(popular_people_reach_less_people).toBe(false);
});