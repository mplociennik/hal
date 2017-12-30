<?php

namespace AppBundle\Entity;

use AppBundle\Utils\Traits\EntityDateTimes;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * SpeechCommand
 *
 * @ORM\Table(name="speech_command")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SpeechCommandRepository")
 */
class SpeechCommand
{
	use EntityDateTimes;
	/**
	 * @var int
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="command", type="string", length=255)
	 */
	private $command;

	/**
	 * @var Language
	 * @ORM\ManyToOne(targetEntity="Language")
	 */
	private $language;

	/**
	 * @ORM\ManyToMany(targetEntity="WsMessage", cascade={"persist"}))
	 * @ORM\JoinTable(name="ws_message_speech_command",
	 *      joinColumns={@ORM\JoinColumn(name="speech_command_id", referencedColumnName="id")},
	 *      inverseJoinColumns={@ORM\JoinColumn(name="ws_message_id", referencedColumnName="id")}
	 *      )
	 */
	private $wsMessages;

	public function __construct()
	{
		$this->wsMessages = new ArrayCollection();
	}

	/**
	 * Get id
	 *
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set command
	 *
	 * @param string $command
	 *
	 */
	public function setCommand(string $command)
	{
		$this->command = $command;
	}

	/**
	 * Get command
	 *
	 * @return string
	 */
	public function getCommand(): string
	{
		return $this->command;
	}

	/**
	 * @return Language
	 */
	public function getLanguage(): Language
	{
		return $this->language;
	}

	/**
	 * @param Language $language
	 */
	public function setLanguage(Language $language)
	{
		$this->language = $language;
	}

	/**
	 * @return Collection
	 */
	public function getWsMessages()
	{
		return $this->wsMessages;
	}

	/**
	 * @param Collection $wsMessages
	 */
	public function setWsMessages($wsMessages)
	{
		$this->wsMessages = $wsMessages;
	}
}

