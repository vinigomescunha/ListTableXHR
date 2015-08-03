var LoadTable = {
    url: "data.json",
    /*url with data*/
    tblId: "TableExample",
    /*Table to receive data*/
    errMesg: 'Erro na recep&ccedil;&atilde;o dos dados!',
    /*error message*/
    alertId: "alert",
    /*alert ID, will be inserted in the table */
    params: { /* params to url */
        action: "list_data",
        "limit": 100,
        "page": 2
    },
    labels: { /* list of fields and labels (key=value) to display in the table */
        "id": "ID",
        "nome": "Nome",
        "email": "E-Mail",
        "endereco": "Endere&ccedil;o Completo",
        "observacao": "Observa&ccedil;&atilde;o",
    },
    urlParams: function(p) {
        /*object params build to get url*/
        return "?" + Object.keys(p).map(function(key) {
            return key + "=" + p[key];
        }).join("&");
    },
    newListJson: function() {
        /* list data table xhr function return json */
        return new Promise(function(success, error) {
            var http = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            http.open('GET', LoadTable.url + LoadTable.urlParams(LoadTable.params), true);
            http.responseType = 'json';
            http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.overrideMimeType("text/plain; charset=x-user-defined");
            http.onload = function() {
                var status = http.status;
                if (status == 200) {
                    success(http.response);
                } else {
                    error(status);
                }
            };
            http.send();
        });
    },
    newCell: function(el) {
        /* createElement(Cell) and return with his data */
        var e = document.createElement(el.type);
        e.innerHTML = el.value;
        return e;
    },
    newData: function(el) {
        /* append data in the table */
        var tr = document.createElement("tr");
        for (var l in LoadTable.labels) {
            if (el.type == "th") {
                var th = LoadTable.newCell({
                    type: el.type,
                    value: LoadTable.labels[l]
                });
            } else {
                var th = LoadTable.newCell({
                    type: el.type,
                    value: el.value[l]
                });
            }
            tr.appendChild(th);

        }
        document.getElementById(LoadTable.tblId).appendChild(tr);
    },
    listData: function(d) {
        /* list Header and Data from JSON to table */
        document.getElementById(LoadTable.tblId).innerHTML = "";
        /*build table header*/
        LoadTable.newData({
            type: "th",
            "value": ""
        });
        /* build table data of json */
        for (var i in d['data']) {
            LoadTable.newData({
                type: "td",
                "value": d['data'][i]
            });
        }
        var last = LoadTable.newCell({
            type: "td",
            value: d.rows + " records found!"
        });
        last.setAttribute("colspan", "100%");
        document.getElementById(LoadTable.tblId).appendChild(LoadTable.newCell({
            type: "tr",
            value: last.outerHTML
        }));
    },
    addAlert: function() {
        /* build alert */
        if (!document.getElementById(LoadTable.alertId) &&
            document.getElementById(LoadTable.tblId)) {
            div = document.createElement('div');
            div.setAttribute("id", LoadTable.alertId);
            table = document.getElementById(LoadTable.tblId);
            table.insertBefore(div, table.firstChild);
        }
    },
    newLbs: function(newLbs) {
        /*additional fields with labels */
        for (var l in newLbs)
            LoadTable.labels[l] = newLbs[l];
    }
};

Load = function(newLbs) {
    /*load and reload data in the tables*/
    LoadTable.addAlert();
    if (newLbs) LoadTable.newLbs(newLbs);
    LoadTable.newListJson().then(function(d) {
        LoadTable.listData(d);
    }, function(status) {
        /*error return message in the table*/
        document.getElementById(LoadTable.tblId).innerHTML = LoadTable.errMesg;
    });
};
/*load data with default fields, see LoadTable.labels */
Load();
/*Reload data with additional fields-labels or Modify label*/
Load({
    "bairro": "Bairro",
    "complemento": "Complemento",
    "telefone_fixo": "T. Fixo"
});

/*   Load({"id": "ID",
      "nome": "Nome",
      "email": "E-Mail",
      "endereco": "Endereço",
      "complemento": "Complemento",
      "bairro": "Bairro",
      "cep": "CEP",
      "telefone_fixo": "Telefone Fixo",
      "telefone_celular": "Telefone Celular",
      "responsavel": "Responsável",
      "observacao": "Observação",
      "excluido": "Excluido"
      });
*/