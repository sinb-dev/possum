<template>
<div>
  <div class="ui stackable grid">
    <div class="ui ten wide tablet column" style="background:#444; height:100vh">
        <shopitems  v-bind:availableItems="availableItems"
                @itemclick="buy" />
    </div>
    <div class="ui two wide column tablet" style="background:#333; height:100vh" >
      <operator-actions />
    </div>
    <div class="ui three wide column " >
        <mode-switcher />
      <total-display v-bind:total="total" style="height:21vh"/>
      <transactionlist v-bind:list="transaction_list" style="height:70vh;overflow:scroll" />
    </div>
  </div>
</div>
</template>

<script>

import shopitems from './operator/shopitems.vue';
import totaldisplay from './operator/total-display.vue';
import transactionlist from './operator/transactionlist.vue';
import cmp_actions from './operator/actions.vue';
import mode_switcher from './mode-switcher.vue';
export default {
    name : "operator-mode",
    components: {shopitems, 'total-display' : totaldisplay, transactionlist, 'operator-actions' : cmp_actions, 'mode-switcher' : mode_switcher},
    data() {
        return {
            availableItems : [
                {id : 1, name: "3 Æbleskiver", price: "15", category : "food"},
                {id : 2, name: "5 Æbleskiver", price: "20", category : "food"},
                {id : 3, name: "Gløgg", price: "5", category : "beverage"},
                {id : 4, name: "Kaffe", price: "5", category : "beverage"},
                {id : 5, name: "Sodavand", price: "10", category : "drink"},
                {id : 6, name: "Risengrød", price: "15", category : "food"},
                {id : 7, name: "Bestik", price: "5", category : "misc"},
                {id : 8, name: "Julegodter", price: "25", category : "candy"},
                {id : 9, name: "Brændte mandler", price: "25", category : "candy"},
                {id : 2, name: "Frugt", price: "5", category : "food"},
            ],
            transactionItems : []
            }
        
    },
    methods : {
        buy(item) {
        console.log(item);
        item.no = this.transactionItems.length + 1;
        this.transactionItems.push({
            no : this.transactionItems.length + 1,
            id : item.id,
            name : item.name,
            price: item.price});
        }
    },
    computed : {
        total() {
            var sum = 0;
            this.transactionItems.forEach(function(item) {
                sum += parseFloat(item.price);
            });
            return sum;
        },
        transaction_list() {
            let map = {};
            let idx = 1;
            this.transactionItems.forEach(function(item) {
                
                if (map[item.id] == undefined) {
                    map[item.id] = {
                        index : idx++,
                        name : item.name,
                        count : 1,
                        price : parseFloat(item.price)
                    }
                } else {
                    map[item.id].count++;
                    map[item.id].price += parseFloat(item.price);
                }
            });
            return map;
        }
    },
    mounted() {
        
        var PouchDB = require('pouchdb-browser').default;
        var db = new PouchDB("possum");
        var self = this;
        db.get("items").then(function(doc) {
            self.availableItems = doc.items;
        });
    }
}
</script>

<style>

</style>