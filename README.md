Introduction
============

The data structure should define an application. This is particularly true when it comes to edit content (instances). VocabForms aims to provide a form where you can create/edit instances in your triple store based on the vocabulary you defined. For example, if you want to create an instance of foaf:Person, you shouldn't need to write a form, since all the relevant information is already in foaf (which properties does a person have, what is the range of such properties, etc.)

VocabForms will look into your vocab and create the needed fields that you can fill. Eventually you can submit it to your triple store or do whatever you want with it.

Installation
============

Right now, I use an experimental branch of LODSPeaKr, so the process is not that easy

* `mkdir /var/www/myForms`
* `cd /var/www/myForms`
* `git clone git://github.com/alangrafu/lodspeakr.git`
* `git checkout vocabform`
* `mkdir vocabforms`
* `cd vocabforms`
* `git clone git://github.com/alangrafu/VocabForms.git`
* `cd ..`
* `ln -s vocabforms/settings.inc.php ` 
* `ln -s vocabforms/components ` 
* Edit properly (check on documentation about LODSPeaKr)

This is a VERY EXPERIMENTAL prototype, so you are discouraged to use it at this point
