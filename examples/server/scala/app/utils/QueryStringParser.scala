package utils

import scala.util.parsing.combinator.RegexParsers

object QueryStringParser extends RegexParsers {
  val key: Parser[String] = """\w+""".r
  val value: Parser[String] = """\w+""".r
  val equalValue: Parser[String] = "=" ~> value
  val pair: Parser[(String, String)] = key ~ equalValue ^^ {
    case key ~ value => key -> value
  }
  val pairList: Parser[Seq[(String, String)]] = repsep(pair, "&")

  val queryString: Parser[Map[String, String]] = pairList ^^ {
    case pairs => pairs.toMap
  }

  def parse(s: String): ParseResult[Map[String, String]] =
    parse(queryString, s)
}
