<template>
  <div class="ui container">
      <modeswitcher />
      <div v-if="pin_entered">
    <h1 class="ui dividing header">Manager mode</h1>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Hidden</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in availableItems" v-bind:key="item.id">
          <td data-label="Item">
            <input
              class="ui input"
              type="text"
              v-model="item.name"
              @change="save"
            />
          </td>
          <td data-label="Price">
            <input type="number" size="6" v-model="item.price" />
          </td>
          <td data-label="Stock">
            <input type="number" size="6" v-model="item.stock" />
          </td>
          <td><select v-model="item.category">
              <option v-for="cat in categories" v-bind:key="cat">{{cat}}</option>
            </select></td>
          <td>
            <div class="ui checked checkbox">
              <input type="checkbox" name="hidden" v-model="item.hidden" />
              <label></label>
            </div>
          </td>
          <td><input type="button" class="ui negative button" @click="remove(item)" value="Remove" /></td>
        </tr>

        <tr>
          <td><input class="ui input" type="text" v-model="newitem.name" /></td>
          <td><input type="number" size="6" v-model="newitem.price" /></td>
          <td><input type="number" size="6" v-model="newitem.stock" /></td>
          <td><select v-model="newitem.category">
              <option v-for="cat in categories" v-bind:key="cat">{{cat}}</option>
            </select></td>
          <td>
            <div class="ui checked checkbox">
              <input type="checkbox" name="hidden" v-model="newitem.hidden" />
              <label></label>
            </div>
          </td>
          <td>
            <input type="button" class="ui button" @click="save" value="Save" />
          </td>
        </tr>
      </tbody>
    </table>
    <input type="button" class="ui blue basic button" @click="crowd" value="Put julevarer i databasen" />
      </div>
      <enter-pin v-if="!pin_entered" @pincode="check_pin"/>
  </div>
</template>

<script>
import enter_pin from './manager/enter-pin.vue';
import modeswitcher from './mode-switcher.vue';
export default {
  name: "owner-mode",
  components : {
    'enter-pin' : enter_pin,
    modeswitcher
  },
  data() {
    return {
      categories : ["food","beverage","drink","goody","misc"],
        pin_entered : false,
        pincode : "",
      newitem: {
        name: "",
        price: "",
        stock: 0,
        category : "",
        hidden: false,
      },
      rev: "",
      availableItems: [
        /*{id : 1, name: "3 Æbleskiver", price: "15", category : "food", hidden : false},
                {id : 2, name: "5 Æbleskiver", price: "20", category : "food"},
                {id : 3, name: "Gløgg", price: "5", category : "beverage"},
                {id : 4, name: "Kaffe", price: "5", category : "beverage"},
                {id : 5, name: "Sodavand", price: "10", category : "drink"},
                {id : 6, name: "Risengrød", price: "15", category : "food"},
                {id : 7, name: "Bestik", price: "5", category : "misc"},
                {id : 8, name: "Julegodter", price: "25", category : "candy"},
                {id : 9, name: "Brændte mandler", price: "25", category : "candy"},
                {id : 10, name: "Frugt", price: "5", category : "food", stock : 10},*/
      ],
      transactionItems: [],
    };
  },
  methods: {
    getNextId() {
      var id = 1;
      this.availableItems.forEach(function (item) {
        if (parseInt(item.id) >= id) {
          id = parseInt(item.id) + 1;
        }
      });
      return id;
    },
    check_pin(pincode) {
        if (pincode == "0000") {
            this.pin_entered = true;
        }
    },
    remove(item) {
      for (var index in this.availableItems) {
          if (this.availableItems[index].id == item.id) {
            break;
          }
      }
      this.availableItems.splice(index,1);
      this.save();
    },
    save() {
      if (this.newitem.name != "") {
            this.availableItems.push({
            id: this.getNextId(),
            name: this.newitem.name,
            price: this.newitem.price,
            category: this.newitem.category,
            stock: this.newitem.stock,
        });
        this.newitem.name = "";
        this.newitem.price = "";
      }
      
      var PouchDB = require("pouchdb-browser").default; //npm install --save pouchdb-browser
      var db = new PouchDB("possum");
      var self = this;
      db.put({
        _id: "items",
        items: this.availableItems,
        _rev: this.rev,
      })
        .then(function () {
          console.log("Saved");
          
          self.load();
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    load() {
      var PouchDB = require("pouchdb-browser").default;
      var db = new PouchDB("possum");
      var self = this;
      db.get("items").then(function (doc) {
        self.availableItems = doc.items;

        self.rev = doc._rev;
      });
    },
    crowd() {
      this.availableItems = [
                {id : 1, name: "3 Æbleskiver", price: "15", category : "food"},
                {id : 2, name: "5 Æbleskiver", price: "20", category : "food"},
                {id : 3, name: "Gløgg", price: "5", category : "beverage"},
                {id : 4, name: "Kaffe", price: "5", category : "beverage"},
                {id : 5, name: "Cola 33 cl", price: "10", category : "drink"},
                {id : 6, name: "Risengrød", price: "15", category : "food"},
                {id : 7, name: "Bestik", price: "5", category : "misc"},
                {id : 8, name: "Julegodter", price: "25", category : "goody"},
                {id : 9, name: "Brændte mandler", price: "25", category : "goody"},
                {id : 2, name: "Frugt", price: "5", category : "food"},
                {id : 5, name: "Appelsin 33 cl", price: "10", category : "drink"},
            ]
      this.save();
    }
  },
  mounted() {
    this.load();
  },
};
</script>

<style>
</style>