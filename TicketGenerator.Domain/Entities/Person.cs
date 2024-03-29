﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketGenerator.Domain.Entities
{
	public class Person
	{
		public int Id { get; set; }

		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string MiddleName { get; set; }

		public virtual ICollection<Ticket> Tickets { get; set; }

		public Person()
		{
			Tickets = new List<Ticket>();
		}
	}
}
