﻿
var selectedItem;

var TicketInfo = function () {

	var eventSectorInfo = function () {

	    var sectorId = $("#SectorId option:selected").val();
	    var eventId = $("#EventId option:selected").val();

	    $.ajax({
			type: "get",
			url: "/Home/GetEventSectorInfo",
			data: "sectorId=" + sectorId + "&eventId=" + eventId,
			dataType: "json",
			contentType: 'application/json',
			success: function (data) {
			    console.log(data);

			    $("#Row").val("");
			    $("#Number").val("");
			    $("#EventDate").val(data.EventDate);
			    $("#Price").val(data.Price);

				$.ajax({
				    type: 'POST',
				    url: "/Home/CreateSvgItems",
				    traditional: true,
				    dataType: 'json',
				    data: JSON.stringify(data),
				    success: function (data) {
				        console.log(data);

				             $("svg#svg1").remove();

				            var canvas = d3.selectAll("#test")
                            .append("svg")
                            .attr("id", "svg1")
                            .attr("width", 1000)
                            .attr("height", 800);
                            	            
                                     

				            var rects = canvas
                                        .append('g')
                                        .selectAll('rect')
                                        .data(data)
                                        .enter()
                                            .append('rect', '1')
                                            .attr({
                                                'x': function (data, index) {
                                                    return data.svgX;
                                                },
                                                'y': function (data, index) {
                                                    return data.svgY;
                                                },
                                                'id': function (data, index) {
	                                                return data.svgId;
                                                },
                                                'width': function (data, index) {
	                                                return 50;
                                                },
                                                'height': function (data, index) {
	                                                return 50;
                                                },
                                                'fill': function (data, index) {
                                                    if (data.svgReserved) {
	                                                    return '#C0C0C0';
                                                    }
                                                    else {
	                                                    return '#006699';
                                                    }
                                                },

                                            })
                                            .on("click", function (data) {
                                                var info = JSON.stringify(data);
                                                if (this.__data__.svgReserved) {
                                                    alert("This ticked is booked!");
                                                    $("#Row").val("");
                                                    $("#Number").val("");
                                                }
                                                else {

	                                                if (selectedItem != undefined) {
	                                                    d3.select('rect#' + selectedItem + '').attr('fill', "#006699");
	                                                    d3.select('text#' + selectedItem + '').remove();
	                                                }
	                                                selectedItem = this.__data__.svgId;
                                                    d3.select('rect#' + this.__data__.svgId + '').attr("fill", "#FFFFCC");
                                                    var recX = $('#' + this.__data__.svgId + '').attr('x');
                                                    var recY = $('#' + this.__data__.svgId + '').attr('y');

                                                    var svg = d3.select("svg#svg1")
                                                                        .attr("width", 1000)
                                                                        .attr("height", 800);

                                                    var text = svg.append("rect:text")
                                                                .attr('id', '' + this.__data__.svgId + '')
                                                                .attr("x", Number(recX) + 25)
                                                                .attr("y", Number(recY) + 25)
                                                                .attr("dy", ".35em")
                                                                .attr("text-anchor", "middle")
                                                                .style("font", "8 8px Helvetica Neue")
                                                                .style("fill", "#006699")
                                                                .text("" + this.__data__.svgCol + "");
                                                    
                                                    $("#Row").val(this.__data__.svgRow);
                                                    $("#Number").val(this.__data__.svgCol);
                                                    $("#SeatId").val(parseInt(this.__data__.svgId.substring(1, this.__data__.svgId.length)));
                                                }
                                            })
				           
				    },
				    error: function (data) { console.log(data) },
				    contentType: 'application/json; charset=UTF-8',
				    processData: false,
				    async: false
				})  // create SVG
				$.ajax({
				    type: 'POST',
				    url: "/Home/CreateSvgRows",
				    traditional: true,
				    dataType: 'json',
				    data: JSON.stringify(data),
				    success: function (data) {
				        console.log(data);			        

				        var canvas = d3.selectAll("#svg1")
                        
				        
				        var rects = canvas
                                    .append('g')
                                    .selectAll('rect')
                                    .data(data)
                                    .enter()
				                         
                                        .append('text', '1')
                                        .attr({
                                            'x': function (data, index) {
                                                return data.svgX;
                                            },
                                            'y': function (data, index) {
                                                return data.svgY;
                                            },
                                            'id': function (data, index) {
                                                return data.svgId
                                            },
                                            'width': function (data, index) {
                                                return 50
                                            },
                                            'height': function (data, index) {
                                                return 50
                                            },
                                            'fill': function (data, index) {
                                                return 'black'
                                            },

                                        }).text(function (data, index) {
                                            return data.svgId
                                        })
				        
                                       
				    },
				    error: function (data) { console.log(data) },
				    contentType: 'application/json; charset=UTF-8',
				    processData: false,
				    async: false
				})  // create Rows 
			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});

	}

	var submitButtonClick = function () {
		$(document).on("submit", "#ticket-form", function (e) {

			e.preventDefault();
			$.ajax({
				url: "/Home/TicketInfo",
				type: "post",
				data: $(this).serialize(),
				success: function (data) {
				    d3.select('rect#r' + data.SeatId + '').attr('fill', "#C0C0C0");
				    d3.select('text#r' + data.SeatId + '').remove();
					window.open("/Home/OpenPDF?id=" + data.TicketId);
				},
				error: function (jqXhr, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
				}
			});

		});
	}

	return {
		EventSectorInfo: eventSectorInfo,
		SubmitButtonClick: submitButtonClick
	};
}();




$(document).ready(function () {
    $.ajax({
        type: 'POST',
        url: "/Home/CreateSvgItems",
        traditional: true,
        dataType: 'json',
        data: [],
        success: function (data) {
            console.log(data);

            $("svg#svg1").remove();

            var canvas = d3.selectAll("#test")
            .append("svg")
            .attr("id", "svg1")
            .attr("width", 1000)
            .attr("height", 800);



            var rects = canvas
                        .append('g')
                        .selectAll('rect')
                        .data(data)
                        .enter()
                            .append('rect', '1')
                            .attr({
                                'x': function (data, index) {
                                    return data.svgX;
                                },
                                'y': function (data, index) {
                                    return data.svgY;
                                },
                                'id': function (data, index) {
                                    return data.svgId
                                },
                                'width': function (data, index) {
                                    return 50
                                },
                                'height': function (data, index) {
                                    return 50
                                },
                                'fill': function (data, index) {
                                    if (data.svgReserved) {
                                        return '#C0C0C0'
                                    }
                                    else {
                                        return '#006699'
                                    }
                                },

                            })
                            .on("click", function (data) {
                                var info = JSON.stringify(data);
                                if (this.__data__.svgReserved) {
                                    alert("This ticked is booked!");
                                    $("#Row").val("");
                                    $("#Number").val("");
                                }
                                else {

                                	if (selectedItem != undefined) {
                                	    d3.select('rect#' + selectedItem + '').attr('fill', "#006699");
                                	    d3.select('text#' + selectedItem + '').remove();
                                	}
                                	selectedItem = this.__data__.svgId;

                                    d3.select('rect#' + this.__data__.svgId + '').attr("fill", "#FFFFCC");
                                    var recX = $('#' + this.__data__.svgId + '').attr('x');
                                    var recY = $('#' + this.__data__.svgId + '').attr('y');

                                    var svg = d3.select("svg#svg1")
                                                        .attr("width", 1000)
                                                        .attr("height", 800);

                                    var text = svg.append("rect:text")
                                                .attr('id', '' + this.__data__.svgId + '')
                                                .attr("x", Number(recX) + 25)
                                                .attr("y", Number(recY) + 25)
                                                .attr("dy", ".35em")
                                                .attr("text-anchor", "middle")
                                                .style("font", "8 8px Helvetica Neue")
                                                .style("fill", "#006699")
                                                .text("" + this.__data__.svgCol + "");
                                    $("#Row").val(this.__data__.svgRow);
                                    $("#Number").val(this.__data__.svgCol);
                                    $("#SeatId").val(parseInt(this.__data__.svgId.substring(1, this.__data__.svgId.length)));
                                }
                            })
        },
        error: function (data) { console.log(data) },
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        async: false
    })  // create SVG first time
    $.ajax({
        type: 'POST',
        url: "/Home/CreateSvgRows",
        traditional: true,
        dataType: 'json',
        data: [],
        success: function (data) {
            console.log(data);

            var canvas = d3.selectAll("#svg1")

            var rects = canvas
                        .append('g')
                        .selectAll('rect')
                        .data(data)
                        .enter()

                            .append('text', '1')
                            .attr({
                                'x': function (data, index) {
                                    return data.svgX;
                                },
                                'y': function (data, index) {
                                    return data.svgY;
                                },
                                'id': function (data, index) {
                                    return data.svgId
                                },
                                'width': function (data, index) {
                                    return 50
                                },
                                'height': function (data, index) {
                                    return 50
                                },
                                'fill': function (data, index) {
                                    return 'black'
                                },

                            }).text(function (data, index) {
                                return data.svgId
                            })


        },
        error: function (data) { console.log(data) },
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        async: false
    })  // create Rows first time
});