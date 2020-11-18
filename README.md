Currently on the repository : a very basic prototype made by Scorpio, modified by Nadawoo.

## Roadmap
### Gathering the data
Listing the variable/textual elements in JSON files :
- Listing the weapons : partially done (in the file /config/weapons.json)
- Listing the characteristics (health, accuracy...) : 0% done
- Listing the pets : 0% done
- Listing the skills :
   - Talents (manual) : 0% done
   - Supers (random) : 0% done
   - Specialities (passive) : 0% done

### Coding
- Implement the weapons :
   - ✔️ Fighting with different weapons: done
- Implement the visible characteristics :
   - ✔️ Standard Health : done
   - ✔️ Complementary Health (see specifications below): done
   - ⌛ Strength : partially done
   - 🧾 Agility : TODO
   - 🧾 Speed : TODO
- Implement the hidden characteristics :
   - ✔️ [Endurance](https://mybrutemuxxu.fandom.com/wiki/Endurance) (Endurance) (1 endurance point = +6 health points): done
   - ✔️ [Armor stat](https://mybrutemuxxu.fandom.com/wiki/Armor_(stat)) (Armure) (lowers the damages): 100% done
   - 🧾 Disarm Rate (Désarmer) (to disarm weapon or shield): TODO
   - 🧾 Initiative (Initiative) (which brute starts the fight): TODO
   - 🧾 Interval (no french doc ?) (more attacks with high "Speed" or a light weapon): TODO
   - 🧾 Combo Rate (Combo) (to hit several times in the same attack): TODO
   - 🧾 Block rate (Parade) (to totally block an attack) : TODO
   - 🧾 Evasion (Esquive) (to totally escape an attack): TODO
   - 🧾 Accuracy (no french doc?) (successful attack against a "Block"): TODO 
   - 🧾 Precision (no french doc ?) (successful attack against an "Evasion"): TODO 
   - 🧾 (No english doc?) Riposte (to strike again after a "Block" or an "Evasion"): TODO
   - 🧾 Counter Rate (Contre) (to strike before the opponent's knock and to abort this knock): TODO
   - 🧾 Reversal Rate (Contre-attaque) (to strike after the opponent's knock): TODO
   - 🧾 Toucher, Porter (what is this?? From the french Twinpedia): TODO
- Implement the skills (ameliorations of the characteristics) :
   - 🧾 Talents (manual activation before the fight; gives a wound) : 0% done
   - 🧾 Supers (randomly triggered during fight) : 0% done
   - 🧾 Specialities (passive aptitudes) : 0% done
      - ⌛ [Armor skill](https://mybrutemuxxu.fandom.com/wiki/Armor): 50% done (increases armor stat: done; decreases speed: TODO)
      - ✔️ [Toughened skin](https://mybrutemuxxu.fandom.com/wiki/Toughened_Skin): 100% done ✓ (increase armor stat: done)
      - ✔️ [Vitality] (https://mybrutemuxxu.fandom.com/wiki/Vitality): done
      - ⌛ [Immortality] (https://mybrutemuxxu.fandom.com/wiki/Immortality): 50%done (endurance +250%: done; all other stats -25%: TODO)
      - ✔️ [Resistant](https://mybrutemuxxu.fandom.com/wiki/Resistant)/Increvable: done (max -20%HP per received hit)
      - (to be completed...)
- 🧾 Implement the pets : 0% done
- Implement the experience
   - 🧾 XP gain after a fight : 0% done
   - 🧾 XP levels : 0% done
   - 🧾 Skills tree (specifications below) : 0% done
   - 🧾 Change destiny after reaching a new XP level : 0% done
- Apply the functionalities to the profiles of the players
   - 🧾 custom weapons list : TODO
   - 🧾 custom skills list  : TODO
   - 🧾 custom characteristics list : TODO
   - 🧾 custom pets list : TODO


##  Specifications
### Weapon types
NB: the names with uppercase refers to "characteristics".
- Fast weapons: increased Combo Rate; relatively low Interval. 
- Heavy weapons (lourdes): high damage but high Interval + lower Accuracy.
- Long weapons: increased Counter rate (= to strike before the opponent)
- Thrown weapons (projectiles): can be throwned in illimited amount.
- Sharp Weapons (tranchantes): high Block Rate ; +50% damages with Weapons Master (passive skill)

All the characteristics of the weapons (with numbers) : https://mybrutemuxxu.fandom.com/wiki/Weapons


### Calculating the health points

The HP are separated in 2 parts:

**Standard HP**:
- SHP are gained by reaching new levels
- SHP are not modified by Skills or Pets.
SHP = (Brute's Level - 1) * 1.5 + 50
*(and the result is rounded down)*

**Complementary HP**:
- CHP are gained with the Endurance stat (+1 CHP for 6 Endurance points).
- CHP are modified by Skills
- CHP are reduced by Pets ([see wiki](https://mybrutemuxxu.fandom.com/wiki/Endurance) for the exact values)
CHP = (Total HP - Standard HP) / 6

Complete doc: https://mybrutemuxxu.fandom.com/wiki/Endurance


### Calculating the damages
See the english wiki to know how to calculate the damages : https://mybrutemuxxu.fandom.com/wiki/Damage
- Damages formula (see below)
- Amount of damages made by each weapon (compare though with the french Twinpedia, which gives ranges: http://twin.tithom.fr/muxxu/labrute/armes/) 
- Skills that influence damage

**Damages formula:**   
Damage = floor((B + NK) * S * R - A) * H
- B = base damage of weapon (constant for each weapon)
- N = Strength
- K = damage per strength of weapon (constant for each weapon)
- S = skills multiplier (Weapons Master x1.50 / Martial Arts x2.00 / Lead Skeleton x0.70)
- R = random number between 1.00 and 1.50
- A = Armor stat (additive; Armor 5 / Toughened Skin 2)
- H = hammer multiplier (x4.00 if Hammer; x1.00 if not) 

### Skills tree
When reaching a new XP level, the player must chose 1 advantage among these 2 choices  :
- Choice 1: 
   - Upgrade a characteristic of +3 points,
     or upgrade a characteristic of +2 points and another of +1 point
- Choice 2: a random element proposed among:
   - 1 weapon
   - 1 skill
   - 1 pet

Source : http://twin.tithom.fr/muxxu/labrute/experience/#arbre

**Restriction for the skills:**  
A brute can't have more than 3 [Main Stat boosters](https://mybrutemuxxu.fandom.com/wiki/Stat_Boosters)
among the 4 existing ones (Vitality, Herculean Strength, Feline Agility, Lightning Bolt)


## Resources
- French wiki : http://twin.tithom.fr/muxxu/labrute/
   - Liste des armes : http://twin.tithom.fr/muxxu/labrute/armes/
   - Liste des compétences : http://twin.tithom.fr/muxxu/labrute/competences/
   - Liste des caractéristiques (vie, endurance...) : http://twin.tithom.fr/muxxu/labrute/caracteristiques/
   - Liste des animaux : http://twin.tithom.fr/muxxu/labrute/familiers/
   - Expérience : http://twin.tithom.fr/muxxu/labrute/experience/
- English wiki : https://mybrutemuxxu.fandom.com/wiki/Mybrute_Wiki
   - List of weapons : https://mybrutemuxxu.fandom.com/wiki/Weapons
   - List of skills : https://mybrutemuxxu.fandom.com/wiki/Skills
   - List of characteristics (health, accuracy...) : https://mybrutemuxxu.fandom.com/wiki/Stats
   - List of pets : https://mybrutemuxxu.fandom.com/wiki/Pets
- Spanish wiki : https://elbrutomuxxu.fandom.com/wiki/
