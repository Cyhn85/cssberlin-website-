from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Literal


Level = Literal["INFO", "OK", "WARN", "ERR"]


class Ansi:
    RESET = "\x1b[0m"
    DIM = "\x1b[2m"
    BOLD = "\x1b[1m"

    RED = "\x1b[31m"
    GREEN = "\x1b[32m"
    YELLOW = "\x1b[33m"
    CYAN = "\x1b[36m"
    MAGENTA = "\x1b[35m"


BOT_COLORS = {
    "SATICI": Ansi.MAGENTA,
    "ALICI": Ansi.CYAN,
    "ADMIN": Ansi.YELLOW,
    "MATRIX": Ansi.GREEN,
}

LEVEL_COLORS = {
    "INFO": Ansi.DIM,
    "OK": Ansi.GREEN,
    "WARN": Ansi.YELLOW,
    "ERR": Ansi.RED,
}


@dataclass(frozen=True)
class LogLine:
    bot: str
    level: Level
    message: str

    def format(self) -> str:
        ts = datetime.now().strftime("%H:%M:%S")
        bot_color = BOT_COLORS.get(self.bot, Ansi.CYAN)
        level_color = LEVEL_COLORS.get(self.level, Ansi.DIM)
        prefix = f"{Ansi.DIM}{ts}{Ansi.RESET} {bot_color}[{self.bot}]{Ansi.RESET}"
        lvl = f"{level_color}{self.level}{Ansi.RESET}"
        return f"{prefix} {lvl} {self.message}"


def log(bot: str, message: str, level: Level = "INFO") -> None:
    print(LogLine(bot=bot, level=level, message=message).format(), flush=True)

